import { Onboarding } from "@/modules/auth/ui/components/onboarding";

const SignUpPage = () => {
  return (
    <div className="min-h-screen bg-blue-600 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Onboarding />
      </div>
    </div>
  );
};

export default SignUpPage;
