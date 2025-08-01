# notifications/observers.py

from django.core.mail import send_mail
from catalyst.constants import CATALYST_EMAIL
from .models import WebPushSubscription
from pywebpush import webpush, WebPushException
import json
from django.conf import settings

class NotificationObserver:
    def send(self, user, message, **kwargs):
        raise NotImplementedError

class EmailObserver(NotificationObserver):
    def send(self, user, message, **kwargs):
        send_mail(
            subject="Your New Learning Notification",
            message=message,
            from_email=CATALYST_EMAIL,
            recipient_list=[user.email],
        )

class PushObserver(NotificationObserver):
    def send(self, user, message, **kwargs):
        subs = WebPushSubscription.objects.filter(user=user)
        for sub in subs:
            try:
                webpush(
                    subscription_info={
                        "endpoint": sub.endpoint,
                        "keys": {"p256dh": sub.p256dh, "auth": sub.auth}
                    },
                    data=json.dumps({"body": message}),
                    vapid_private_key=settings.VAPID_PRIVATE_KEY,
                    vapid_claims={"sub": "mailto:rmitu22@gmail.com"},
                )
            except WebPushException as e:
                if hasattr(e, "response") and e.response and e.response.status_code in [404, 410]:
                    sub.delete()

class NotificationDistributor:
    def __init__(self):
        self.observers = []

    def register(self, observer):
        self.observers.append(observer)

    def notify(self, user, message, **kwargs):
        for observer in self.observers:
            observer.send(user, message, **kwargs)
