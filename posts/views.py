from django.shortcuts import render
from django.http import HttpResponse
from .models import Posts

# Create your views here.
def home(request):
    
    user = request.user

    context = {
        'title': 'Wat de vak?!',
        'user': user
    }

    return render(request, 'posts/home.html', context)


def index(request):

    posts = Posts.objects.all()[:10]
    user = request.user
    context = {
        'title': 'Overzicht werkzaamheden',
        'posts': posts,
        'user': user
    }

    return render(request, 'posts/index.html', context)

def details(request, id):
    post = Posts.objects.get(id=id)

    context = {
        'post': post
    }
    return render(request, 'posts/details.html', context)