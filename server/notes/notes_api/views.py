from django.shortcuts import render
from rest_framework import generics
from .models import Note
from .serializers import NoteSerializer

class NoteListCreateView(generics.ListCreateAPIView):
    queryset = Note.objects.all().order_by('-created_at')  # Show newest first
    serializer_class = NoteSerializer

class NoteRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer