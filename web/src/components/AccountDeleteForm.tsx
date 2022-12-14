import Alert from "./Alert";
import Button from "./Button";
import classes from "../styles/components/AccountDeleteForm.module.scss";
import Field from "./Field";
import FormActions from "./FormActions";
import Input from "./Input";
import InputError from "./InputError";
import Label from "./Label";
import useApi from "../hooks/useApi";
import useAuthn from "../hooks/useAuthn";
import { handleApiError } from "../lib/utils";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useState } from "react";

interface FormData {
  password: string;
}

export default function AccountDeleteForm() {
  const [formError, setFormError] = useState<string>();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const { accountDestroy } = useApi();
  const { logout } = useAuthn();

  const {
    formState: { errors: fieldErrors },
    handleSubmit,
    register,
    setError: setFieldError,
  } = useForm<FormData>();

  const onSubmit = handleSubmit(async (data: FormData) => {
    setSubmitting(true);

    if (
      !window.confirm(
        "Are you sure you want to delete your account, and permanently delete all of your data?"
      )
    ) {
      setSubmitting(false);
      return;
    }

    const response = await accountDestroy(data);
    setSubmitting(false);

    if (response.isError) {
      return handleApiError<FormData>(response, {
        setFieldError,
        setFormError,
      });
    }

    logout(() => navigate("/", { replace: true }));
  });

  const onAlertDismiss = () => setFormError(undefined);

  return (
    <form className={classes.form} onSubmit={onSubmit}>
      {formError && (
        <Alert onDismiss={onAlertDismiss} variant="error">
          {formError}
        </Alert>
      )}

      <Field>
        <Label htmlFor="password">Password</Label>
        <Input
          disabled={submitting}
          error={!!fieldErrors?.password?.message}
          id="password"
          type="password"
          {...register("password", { required: "Password is required." })}
        />
        <InputError error={fieldErrors?.password?.message} />
      </Field>

      <FormActions>
        <Button
          color="red"
          disabled={submitting}
          type="submit"
          variant="filled"
        >
          Delete account
        </Button>
      </FormActions>
    </form>
  );
}
