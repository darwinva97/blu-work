"use client";
import { Formik } from "formik";

type TInputProps = {
  label: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = ({ label, required, error, ...props }: TInputProps) => {
  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">
          {label} {required && "*"}
        </span>
      </label>
      <input className="input input-bordered w-full" {...props} />
      <label className="label">
        {error && <span className="label-text-alt">{error}</span>}
      </label>
    </div>
  );
};

type TTextareaProps = {
  label: string;
  error?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = ({ label, required, error, ...props }: TTextareaProps) => {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">
          {label} {required && "*"}
        </span>
      </label>
      <textarea
        className="textarea textarea-bordered h-24"
        {...props}
      ></textarea>
      <label className="label">
        {error && <span className="label-text-alt">{error}</span>}
      </label>
    </div>
  );
};

type TDataForm = {
  name: string;
  email: string;
  feedback: string;
};

const Page = () => {
  return (
    <div className="h-[100vh] w-full flex bg-yellow-300 justify-center items-center">
      <Formik
        initialValues={{ name: "", email: "", feedback: "" }}
        validate={(values) => {
          const errors: Partial<TDataForm> = {};

          Object.entries(values).forEach(([key, value]) => {
            if (value === "") {
              errors[key as keyof TDataForm] = "Este campo es requerido";
            }
          });
          if (!values.email) {
            errors.email = "Este campo es requerido";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = "El correo electrónico es inválido";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          fetch("/api/email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          })
            .then((res) => res.json())
            .then((res) => alert(res.message))
            .finally(() => {
              setSubmitting(false);
              resetForm();
            });
        }}
      >
        {({
          values,
          errors,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-stretch p-[5rem]"
          >
            <h1 className="text-2xl font-bold text-center max-w-md">
              AYUDANOS A LANZAR LA MEJOR VERSIÓN DE BLU WORK
            </h1>
            <Input
              label="Nombre"
              name="name"
              required
              placeholder="ejm: Juan Gonzáles"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
              error={errors.name}
            />
            <Input
              label="Correo"
              name="email"
              required
              placeholder="ejm: user@gmail.com"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
              error={errors.email}
            />

            <Textarea
              label="Feedback"
              name="feedback"
              required
              placeholder="ejm: Me encanta su plataforma!"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.feedback}
              error={errors.feedback}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? "Enviando..." : "Enviar"}
            </button>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default Page;
