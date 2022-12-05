import Alert from "./Alert";
import Button from "./Button";
import Field from "./Field";
import FormActions from "./FormActions";
import Input from "./Input";
import InputError from "./InputError";
import Label from "./Label";
import useApi from "../hooks/useApi";
import { Dialog, DialogContent, DialogTitle } from "./Dialog";
import { handleApiError } from "../lib/utils";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useState } from "react";

import classes from "../styles/components/SignupForm.module.scss";

interface FormData {
  email: string;
  password: string;
  username: string;
}

export default function SignupForm() {
  const [formError, setFormError] = useState<string>();
  const [openSuccessDialog, setOpenSuccessDialog] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>();
  const navigate = useNavigate();
  const { createSignup } = useApi();

  const {
    formState: { errors: fieldErrors },
    handleSubmit,
    register,
    setError: setFieldError,
  } = useForm<FormData>();

  const onDialogOpenChange = (open: boolean) => {
    if (!open) {
      navigate("/login", { replace: true });
    }
  };

  const onDialogDismiss = () => setOpenSuccessDialog(false);

  const onFormSubmit = handleSubmit(async (data: FormData) => {
    setSubmitting(true);
    const response = await createSignup(data);
    setSubmitting(false);

    if (response.isError) {
      return handleApiError<FormData>(response, {
        setFieldError,
        setFormError,
      });
    }

    setSuccessMessage(response?.message ?? "You signed up successfully.");
    setOpenSuccessDialog(true);
  });

  const onAlertDismiss = () => setFormError(undefined);

  return (
    <>
      <Dialog open={openSuccessDialog} onOpenChange={onDialogOpenChange}>
        <DialogContent onDismiss={onDialogDismiss}>
          <Alert variant="success">
            <DialogTitle asChild>
              <h1 className={classes.dialogHeading}>Sign Up Success</h1>
            </DialogTitle>
            {successMessage}
          </Alert>
        </DialogContent>
      </Dialog>

      <form onSubmit={onFormSubmit}>
        {formError && (
          <Alert onDismiss={onAlertDismiss} variant="error">
            {formError}
          </Alert>
        )}

        <Field>
          <Label htmlFor="username">Username</Label>
          <Input
            disabled={submitting}
            error={!!fieldErrors?.username?.message}
            id="username"
            type="text"
            {...register("username", { required: "Username is required." })}
          />
          <InputError error={fieldErrors?.username?.message} />
        </Field>

        <Field>
          <Label htmlFor="email">Email</Label>
          <Input
            disabled={submitting}
            error={!!fieldErrors?.email?.message}
            id="email"
            type="text"
            {...register("email", { required: "Email is required." })}
          />
          <InputError error={fieldErrors?.email?.message} />
        </Field>

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
            color="primary"
            disabled={submitting}
            type="submit"
            variant="filled"
          >
            Sign up
          </Button>
        </FormActions>
      </form>
    </>
  );
}
