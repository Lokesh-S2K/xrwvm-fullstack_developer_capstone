# Uncomment the required imports before adding the code

from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib.auth import logout
from django.contrib import messages
from datetime import datetime

from django.http import JsonResponse
from django.contrib.auth import login, authenticate
import logging
import json
from django.views.decorators.csrf import csrf_exempt
from .models import CarMake, CarModel
from .populate import initiate
# from .populate import initiate


# Get an instance of a logger
logger = logging.getLogger(__name__)


# Create your views here.

# Create a `login_request` view to handle sign in request
@csrf_exempt
def login_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username")
            password = data.get("password")
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return JsonResponse({"status": True, "userName": username})
            else:
                return JsonResponse({"status": False, "message": "Invalid credentials"}, status=401)
        except Exception as e:
            return JsonResponse({"status": False, "message": str(e)}, status=400)
    else:
        return JsonResponse({"status": False, "message": "Only POST allowed"}, status=405)

# Create a `logout_request` view to handle sign out request
def logout_user(request):
    logout(request)
    return JsonResponse({"userName": ""})
# Create a `registration` view to handle sign up request

@csrf_exempt
def register_user(request):
    context = {}
    if request.method == "POST":
        data = json.loads(request.body)
        username = data["userName"]
        password = data["password"]
        first_name = data["firstName"]
        last_name = data["lastName"]
        email = data["email"]
        if User.objects.filter(username=username).exists():
            context["error"] = "Already Registered"
        else:
            user = User.objects.create_user(
                username=username,
                password=password,
                first_name=first_name,
                last_name=last_name,
                email=email,
            )
            login(request, user)
            context["userName"] = user.username
            context["status"] = True
    return JsonResponse(context)
# ...
def get_cars(request):
    count = CarMake.objects.all().count()
    if count == 0:
        initiate()

    car_models = CarModel.objects.select_related('car_make')
    cars = []
    for model in car_models:
        cars.append({
            "CarModel": model.name,
            "CarMake": model.car_make.name,
            "Type": model.type,
            "Year": model.year.year
        })
    return JsonResponse({"CarModels": cars})
# # Update the `get_dealerships` view to render the index page with
# a list of dealerships
# def get_dealerships(request):
# ...

# Create a `get_dealer_reviews` view to render the reviews of a dealer
# def get_dealer_reviews(request,dealer_id):
# ...

# Create a `get_dealer_details` view to render the dealer details
# def get_dealer_details(request, dealer_id):
# ...

# Create a `add_review` view to submit a review
# def add_review(request):
# ...
