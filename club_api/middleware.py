"""
=============================================================================
Voyager Coding Club - Custom CORS Middleware
=============================================================================
Zero-dependency Cross-Origin Resource Sharing (CORS) middleware.
Ensures the Django REST API can be queried seamlessly across all network
interfaces (localhost, Wi-Fi LAN devices, external test clients).
=============================================================================
"""

from django.http import HttpResponse


class CustomCorsMiddleware:
    """
    Appends standard CORS headers to all HTTP responses.
    Handles HTTP OPTIONS pre-flight checks automatically.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Intercept and acknowledge pre-flight CORS requests
        if request.method == "OPTIONS":
            response = HttpResponse()
        else:
            response = self.get_response(request)

        # Allow requests from any origin (e.g. mobile phones on Wi-Fi, Vite dev servers)
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, POST, PUT, PATCH, DELETE, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With, Accept"
        return response
