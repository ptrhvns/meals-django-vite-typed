import Alert from "../components/Alert";
import Anchor from "../components/Anchor";
import Breadcrumbs from "../components/Breadcrumbs";
import classes from "../styles/routes/TagNew.module.scss";
import Heading from "../components/Heading";
import Navbar from "../components/Navbar";
import PageLayout from "../components/PageLayout";
import RequireAuthn from "../components/RequireAuthn";
import Skeleton from "../components/Skeleton";
import TagNewForm from "../components/TagNewForm";
import useApi from "../hooks/useApi";
import { buildTitle, handleApiError } from "../lib/utils";
import { Helmet } from "react-helmet-async";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { useParams } from "react-router-dom";
import { useState } from "react";

export default function TagNew() {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [tags, setTags] = useState<string[]>([]);
  const { recipeId } = useParams() as { recipeId: string };
  const { tagsGet } = useApi();

  useEffectOnce(async () => {
    const response = await tagsGet();
    setLoading(false);

    if (response.isError) {
      handleApiError(response, { setError });
      return;
    }

    setTags(response.data.tags.map((t: { name: string }) => t.name));
  });

  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("Create Tag")}</title>
      </Helmet>

      <Navbar />

      <PageLayout containerClassName={classes.pageLayout}>
        <Breadcrumbs>
          <Anchor to="/dashboard">Dashboard</Anchor>
          <Anchor to={`/recipe/${recipeId}`}>Recipe</Anchor>
          Create Tag
        </Breadcrumbs>

        <Heading>Create Tag</Heading>

        {loading && (
          <div>
            <Skeleton height="1.3rem" width="2.75rem" />
            <Skeleton height="2.3rem" />
            <Skeleton height="2.3rem" width="6.6rem" />
          </div>
        )}

        {!loading && error && (
          <Alert onDismiss={() => setError(undefined)} variant="error">
            {error}
          </Alert>
        )}

        {!loading && !error && <TagNewForm tags={tags} />}
      </PageLayout>
    </RequireAuthn>
  );
}