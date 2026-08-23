import urllib.request
import urllib.error
import json

def test_endpoints():
    print("--- TESTING FRONTEND & BACKEND REBUILD ---")

    # 1. Backend Login Endpoint for Demo Users
    login_url = "http://localhost:8000/auth/login"
    payload = json.dumps({"email": "student.demo@edubridge.local", "password": "Demo@123"}).encode('utf-8')
    req = urllib.request.Request(login_url, data=payload, headers={'Content-Type': 'application/json'}, method='POST')

    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            print("OK - Backend /auth/login SUCCESS:", data["user"]["email"], "Role:", data["user"]["role"])
            assert "access_token" in data
            token = data["access_token"]
    except urllib.error.HTTPError as e:
        print("FAIL - HTTPError on login:", e.code, e.read().decode('utf-8'))
        return False
    except Exception as e:
        print("FAIL - Exception on login:", e)
        return False

    # 2. Backend /auth/me Token Verification
    me_url = f"http://localhost:8000/auth/me?token={token}"
    req_me = urllib.request.Request(me_url, method='GET')
    try:
        with urllib.request.urlopen(req_me) as resp:
            data_me = json.loads(resp.read().decode('utf-8'))
            print("OK - Backend /auth/me JWT validation SUCCESS for:", data_me["email"])
    except Exception as e:
        print("FAIL - /auth/me failed:", e)
        return False

    # 3. Frontend Next.js Server check
    fe_url = "http://localhost:3000/login"
    try:
        with urllib.request.urlopen(fe_url) as resp:
            html = resp.read().decode('utf-8')
            print("OK - Frontend /login HTTP status:", resp.status)
            assert "Sign In" in html
    except Exception as e:
        print("FAIL - Frontend /login unreachable:", e)
        return False

    print("\nALL BACKEND & FRONTEND HTTP ENDPOINT TESTS PASSED SUCCESSFULLY!")
    return True

if __name__ == '__main__':
    test_endpoints()
