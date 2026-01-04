import os
import time
import json
from urllib.request import urlopen
from urllib.error import URLError, HTTPError


def _url(base: str, path: str) -> str:
    return f"{base.rstrip('/')}{path}"


def _get_json(url: str) -> dict:
    with urlopen(url) as response:
        return json.loads(response.read().decode("utf-8"))


def load_health_catalog_config(
    retries: int = 5,
    delay_seconds: int = 2
) -> dict:
    hc_base = os.getenv("HEALTH_CATALOG_URL", "http://health-catalog:8000")
    active_env = os.getenv("ACTIVE_ENV", "docker")

    last_error = None

    for attempt in range(1, retries + 1):
        try:
            print(f"[CONFIG] Loading Health Catalog (attempt {attempt}/{retries})")

            endpoints = _get_json(_url(hc_base, "/endpoints"))["data"]
            topics = _get_json(_url(hc_base, "/topics"))["data"]
            thresholds = _get_json(_url(hc_base, "/thresholds"))["data"]

            # environments is OPTIONAL for now
            try:
                environments = _get_json(_url(hc_base, "/environments"))["data"]
                env_cfg = environments.get(active_env, {})
            except HTTPError as e:
                if e.code == 404:
                    print("[CONFIG] /environments not found, using empty env_config")
                    env_cfg = {}
                else:
                    raise

            config = {
                "environment": active_env,
                "services": endpoints,
                "env_config": env_cfg,
                "topics": topics,
                "thresholds": thresholds
            }

            print("[CONFIG] Health Catalog loaded successfully")
            print(f"[CONFIG] Active environment: {active_env}")

            return config

        except (HTTPError, URLError, KeyError, json.JSONDecodeError) as e:
            last_error = e
            print(
                f"[CONFIG] Health Catalog not ready "
                f"(attempt {attempt}/{retries}): {e}"
            )
            time.sleep(delay_seconds)

    raise RuntimeError(
        f"Health Catalog unavailable after {retries} attempts: {last_error}"
    )
