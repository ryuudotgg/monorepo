"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";

import { Alert, AlertDescription } from "@ryuu/design/components/ui/alert";
import { Button } from "@ryuu/design/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@ryuu/design/components/ui/form";
import { Input } from "@ryuu/design/components/ui/input";
import { emailSchema } from "@ryuu/validators";

import Email from "~/assets/email.svg";
import { signUpWithEmailAction } from "./action";

export default function SignUpEmailForm() {
  const { form, action, handleSubmitWithAction } = useHookFormAction(
    signUpWithEmailAction,
    zodResolver(emailSchema),
    { formProps: { defaultValues: { email: "" } } },
  );

  console.log(form.formState.errors);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmitWithAction}>
        {form.formState.errors.root?.message && (
          <>
            <Alert variant="destructive" fill="destructive">
              <AlertDescription>
                {form.formState.errors.root.message}
              </AlertDescription>
            </Alert>

            <span className="mt-[23px] ml-[23px] block h-[1px] min-h-[1px] w-[1px] min-w-[1px] select-none" />
          </>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="email"
                  className="h-12 px-3 py-0 text-base"
                  placeholder="Email Address"
                  autoComplete="off"
                  formNoValidate
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <span className="mt-[11px] ml-[23px] block h-[1px] min-h-[1px] w-[1px] min-w-[1px] select-none" />

        <Button
          size="lg"
          className="w-full"
          type="submit"
          disabled={form.formState.isSubmitting || action.isPending}
        >
          <Email className="mr-2 size-4" />
          Continue with Email
        </Button>
      </form>
    </Form>
  );
}
