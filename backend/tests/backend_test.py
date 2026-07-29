"""Elvora-X backend API tests."""
import os
import time
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://spotless-pure.preview.emergentagent.com').rstrip('/')
# Load frontend .env if REACT_APP_BACKEND_URL not set
if not os.environ.get('REACT_APP_BACKEND_URL'):
    try:
        with open('/app/frontend/.env') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    BASE_URL = line.strip().split('=', 1)[1].rstrip('/')
    except Exception:
        pass

ADMIN_EMAIL = "admin@elvora-x.com"
ADMIN_PASSWORD = "Elvora@2025"


@pytest.fixture(scope="session")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def token(api):
    r = api.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"Login failed: {r.status_code} {r.text}"
    return r.json()["access_token"]


@pytest.fixture(scope="session")
def auth_headers(token):
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}


# ---- Products ----
class TestProducts:
    def test_get_products(self, api):
        r = api.get(f"{BASE_URL}/api/products")
        assert r.status_code == 200
        data = r.json()
        assert "products" in data and "features" in data
        assert len(data["products"]) == 3
        assert len(data["features"]) == 5
        ids = {p["id"] for p in data["products"]}
        assert ids == {"forest-blossom", "forest-dew", "royal-forest"}


# ---- Enquiries public ----
class TestEnquiryCreate:
    def test_create_enquiry(self, api):
        payload = {
            "name": "TEST_User",
            "email": "test_user@example.com",
            "phone": "9999999999",
            "message": "TEST_ enquiry message",
            "enquiry_type": "general",
        }
        r = api.post(f"{BASE_URL}/api/enquiries", json=payload)
        assert r.status_code == 200, r.text
        d = r.json()
        # BUG: backend returns "_id" not "id" (FastAPI response_model uses by_alias=True)
        assert d.get("id") or d.get("_id"), f"No id in response: {d}"
        assert d["status"] == "new"
        assert d["name"] == "TEST_User"
        assert d["email"] == "test_user@example.com"

    def test_create_enquiry_invalid_email(self, api):
        payload = {"name": "x", "email": "not-an-email", "phone": "1234", "message": "hi"}
        r = api.post(f"{BASE_URL}/api/enquiries", json=payload)
        assert r.status_code == 422


# ---- Auth ----
class TestAuth:
    def test_login_success(self, api):
        r = api.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200
        d = r.json()
        assert "access_token" in d
        assert d["token_type"] == "bearer"
        assert d["user"]["email"] == ADMIN_EMAIL

    def test_login_wrong_password(self, api):
        r = api.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"})
        assert r.status_code == 401

    def test_me_no_token(self, api):
        r = requests.get(f"{BASE_URL}/api/auth/me")
        assert r.status_code == 401

    def test_me_with_token(self, auth_headers):
        r = requests.get(f"{BASE_URL}/api/auth/me", headers=auth_headers)
        assert r.status_code == 200
        assert r.json()["email"] == ADMIN_EMAIL


# ---- Protected enquiries endpoints ----
class TestAdminEnquiries:
    def test_list_requires_auth(self):
        r = requests.get(f"{BASE_URL}/api/enquiries")
        assert r.status_code == 401

    def test_list_with_auth(self, auth_headers):
        r = requests.get(f"{BASE_URL}/api/enquiries", headers=auth_headers)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        # verify sort newest-first if >1
        if len(data) > 1:
            assert data[0]["created_at"] >= data[1]["created_at"]

    def test_stats(self, auth_headers):
        r = requests.get(f"{BASE_URL}/api/enquiries/stats", headers=auth_headers)
        assert r.status_code == 200
        d = r.json()
        for k in ("total", "new", "bulk"):
            assert k in d and isinstance(d[k], int)

    def test_patch_marks_read(self, api, auth_headers):
        # create
        c = api.post(f"{BASE_URL}/api/enquiries", json={
            "name": "TEST_Patch", "email": "tp@example.com", "phone": "1234567",
            "message": "patch me", "enquiry_type": "bulk"
        })
        eid = c.json().get("id") or c.json().get("_id")
        r = requests.patch(f"{BASE_URL}/api/enquiries/{eid}", headers=auth_headers)
        assert r.status_code == 200
        assert r.json()["status"] == "read"

    def test_delete(self, api, auth_headers):
        c = api.post(f"{BASE_URL}/api/enquiries", json={
            "name": "TEST_Delete", "email": "td@example.com", "phone": "1234567",
            "message": "del me"
        })
        eid = c.json().get("id") or c.json().get("_id")
        r = requests.delete(f"{BASE_URL}/api/enquiries/{eid}", headers=auth_headers)
        assert r.status_code == 200
        assert r.json()["success"] is True
        # Verify gone: patch should 404
        r2 = requests.patch(f"{BASE_URL}/api/enquiries/{eid}", headers=auth_headers)
        assert r2.status_code == 404

    def test_stats_reflects_bulk(self, api, auth_headers):
        before = requests.get(f"{BASE_URL}/api/enquiries/stats", headers=auth_headers).json()
        api.post(f"{BASE_URL}/api/enquiries", json={
            "name": "TEST_Bulk", "email": "tb@example.com", "phone": "1234567",
            "message": "bulk order", "enquiry_type": "bulk"
        })
        after = requests.get(f"{BASE_URL}/api/enquiries/stats", headers=auth_headers).json()
        assert after["bulk"] >= before["bulk"] + 1
        assert after["total"] >= before["total"] + 1


# Cleanup TEST_ enquiries at end of session
@pytest.fixture(scope="session", autouse=True)
def cleanup(auth_headers):
    yield
    try:
        r = requests.get(f"{BASE_URL}/api/enquiries", headers=auth_headers)
        for e in r.json():
            if str(e.get("name", "")).startswith("TEST_"):
                eid = e.get('id') or e.get('_id')
                requests.delete(f"{BASE_URL}/api/enquiries/{eid}", headers=auth_headers)
    except Exception:
        pass
