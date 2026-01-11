# from typing import List
# from queue import Queue


# class AlertEventStream:
#     """
#     Manages SSE subscribers for alert events.
#     Each subscriber has its own queue.
#     """

#     def __init__(self):
#         self.subscribers: List[Queue] = []

#     def subscribe(self) -> Queue:
#         q = Queue()
#         self.subscribers.append(q)
#         return q

#     def unsubscribe(self, q: Queue):
#         if q in self.subscribers:
#             self.subscribers.remove(q)

#     def publish(self, event: dict):
#         for q in self.subscribers:
#             q.put(event)


# # singleton instance
# alert_event_stream = AlertEventStream()
