import requests

def get_cart_details(user_id):
    try:
        url = f"http://127.0.0.1:8001/api/user/cart/cart-list/{user_id}"
        response = requests.get(url)
        return response.json()
    except:
        return False

def delete_cart(user_id):
    try:
        url = f"http://127.0.0.1:8001/api/user/cart/deletecart/{user_id}"
        response = requests.delete(url)
        if response.status_code == 204:
            return True
        return False
    except:
        return False
