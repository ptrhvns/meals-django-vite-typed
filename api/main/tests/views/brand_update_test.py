import pytest
from django.http import Http404
from django.urls import reverse
from pytest_mock import MockerFixture
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import (
    HTTP_204_NO_CONTENT,
    HTTP_404_NOT_FOUND,
    HTTP_422_UNPROCESSABLE_ENTITY,
)
from rest_framework.test import APIRequestFactory

from main.tests.factories import BrandFactory, UserFactory
from main.tests.support.drf_view_helpers import (
    sets_http_method_names,
    sets_permission_classes,
)
from main.tests.support.request_helpers import authenticate
from main.views.brand_update import brand_update


def test_http_method_names() -> None:
    assert sets_http_method_names(brand_update, ["options", "post"])


def test_permission_classes() -> None:
    permission_classes = [IsAuthenticated]
    assert sets_permission_classes(brand_update, permission_classes)


def test_brand_not_found(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    request = api_rf.post(reverse("brand_update", kwargs={"brand_id": 1}))
    user = UserFactory.build()
    authenticate(request, user)
    mocker.patch(
        "main.views.brand_update.get_object_or_404",
        autospec=True,
        side_effect=Http404,
    )
    response = brand_update(request, 1)
    assert response.status_code == HTTP_404_NOT_FOUND


def test_invalid_request_data(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    request = api_rf.post(reverse("brand_update", kwargs={"brand_id": 1}), {})
    user = UserFactory.build()
    authenticate(request, user)
    brand = BrandFactory.build(name="Acme")
    mocker.patch(
        "main.views.brand_update.get_object_or_404",
        autospec=True,
        return_value=brand,
    )
    response = brand_update(request, 1)
    assert response.status_code == HTTP_422_UNPROCESSABLE_ENTITY


def test_new_name_same_as_old_name(
    api_rf: APIRequestFactory, mocker: MockerFixture
) -> None:
    name = "Acme"
    request = api_rf.post(
        reverse("brand_update", kwargs={"brand_id": 1}), {"name": name}
    )
    user = UserFactory.build()
    authenticate(request, user)
    brand = BrandFactory.build(name=name)
    mocker.patch(
        "main.views.brand_update.get_object_or_404",
        autospec=True,
        return_value=brand,
    )
    response = brand_update(request, 1)
    assert response.status_code == HTTP_204_NO_CONTENT


@pytest.mark.django_db()
def test_new_name_already_taken(api_rf: APIRequestFactory) -> None:
    taken_name = "TakenName"
    user = UserFactory.create()
    BrandFactory.create(name=taken_name, user=user)
    brand = BrandFactory.create(name="OldName", user=user)
    request = api_rf.post(
        reverse("brand_update", kwargs={"brand_id": brand.id}), {"name": taken_name}
    )
    authenticate(request, user)
    response = brand_update(request, brand.id)
    assert response.status_code == HTTP_422_UNPROCESSABLE_ENTITY
    assert len(response.data["errors"]) > 0  # type: ignore[index]
    assert len(response.data["message"]) > 0  # type: ignore[index]


@pytest.mark.django_db()
def test_updated_brand_successfully(api_rf: APIRequestFactory) -> None:
    user = UserFactory.create()
    brand = BrandFactory.create(name="OldName", user=user)
    request = api_rf.post(
        reverse("brand_update", kwargs={"brand_id": brand.id}), {"name": "NewName"}
    )
    authenticate(request, user)
    response = brand_update(request, brand.id)
    assert response.status_code == HTTP_204_NO_CONTENT
    brand.refresh_from_db()
    assert brand.name == "NewName"
