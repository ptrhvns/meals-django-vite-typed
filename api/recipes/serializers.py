from rest_framework.serializers import ModelSerializer

from recipes.models import Recipe, Tag


class RecipeCreateRequestSerializer(ModelSerializer):
    class Meta:
        model = Recipe
        fields = ("title",)


class RecipeCreateResponseSerializer(ModelSerializer):
    class Meta:
        model = Recipe
        fields = ("id",)


class RecipesResponseSerializer(ModelSerializer):
    class Meta:
        model = Recipe
        fields = ("id", "title")


class RecipeTitleUpdateRequestSerializer(ModelSerializer):
    class Meta:
        model = Recipe
        fields = ("title",)


class TagAssociateRequestSerializer(ModelSerializer):
    class Meta:
        model = Tag
        fields = ("name",)


class TagCreateRequestSerializer(ModelSerializer):
    class Meta:
        model = Tag
        fields = ("name",)


class TagRequestSerializer(ModelSerializer):
    class Meta:
        model = Tag
        fields = ("id", "name")


class TagsResponseSerializer(ModelSerializer):
    class Meta:
        model = Tag
        fields = (
            "id",
            "name",
        )


class TagUpdateRequestSerializer(ModelSerializer):
    class Meta:
        model = Tag
        fields = ("name",)


class RecipeResponseSerializer(ModelSerializer):
    class Meta:
        model = Recipe
        fields = ("id", "tags", "title")

    tags = TagsResponseSerializer(many=True, required=False)
