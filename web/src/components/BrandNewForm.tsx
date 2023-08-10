import Button from "./Button";
import Field from "./Field";
import FormActions from "./FormActions";
import FormError from "./FormError";
import InputError from "./InputError";
import LabelDiv from "./LabelDiv";
import useApi from "../hooks/useApi";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { handleApiError } from "../lib/utils";
import InputDiv from "./InputDiv";

interface FormData {
  name: string;
}

export default function BrandNewForm() {
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState<boolean>();
  const navigate = useNavigate();
  const { brandCreate } = useApi();

  const {
    formState: { errors: fieldErrors },
    handleSubmit,
    register,
    setError: setFieldError,
  } = useForm<FormData>();

  return (
    <form
      onSubmit={handleSubmit(async (data: FormData) => {
        setSubmitting(true);
        const response = await brandCreate({ data });
        setSubmitting(false);

        if (response.isError) {
          handleApiError(response, { setError, setFieldError });
          return;
        }

        navigate("/dashboard/brands", { replace: true });
      })}
    >
      <FormError error={error} setError={setError} />

      <Field>
        <LabelDiv htmlFor="name">Name</LabelDiv>
        <InputDiv
          disabled={submitting}
          error={!!fieldErrors?.name?.message}
          id="name"
          type="text"
          {...register("name", { required: "Name is required." })}
        />
        <InputError error={fieldErrors?.name?.message} />
      </Field>

      <FormActions>
        <Button
          color="primary"
          disabled={submitting}
          type="submit"
          variant="filled"
        >
          Create
        </Button>

        <Button
          disabled={submitting}
          onClick={() => navigate("/dashboard/brands")}
          type="button"
        >
          Dismiss
        </Button>
      </FormActions>
    </form>
  );
}
