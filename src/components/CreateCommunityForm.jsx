import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import CustomInput from "./CustomInput";
import { Textarea } from "./ui/textarea";
import { CreateCommunitySchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { checkUsernameAvailability, createCommunity } from "@/services";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router";

function CreateCommunityForm({
  triggerLabel = "Create Community",
  triggerClassName = "",
  triggerVariant = "secondary",
  triggerSize = "lg",
}) {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(CreateCommunitySchema),
  });

  const [usernameInput, setUsernameInput] = useState("");
  const [debouncedUsername, setDebouncedUsername] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedUsername(usernameInput);
    }, 500);

    return () => clearTimeout(handler);
  }, [usernameInput]);

  const isCommunityAliasValid = !errors.communityUsername;

  const { data: usernameCheckData, isFetching: checkingUsername } = useQuery({
    queryKey: ["checkUsername", debouncedUsername],
    queryFn: () => checkUsernameAvailability(debouncedUsername),
    enabled: !!debouncedUsername && isCommunityAliasValid,
  });

  useEffect(() => {
    if (usernameCheckData?.data?.content) {
      setUsernameAvailable(usernameCheckData.data.content.isAvailable);
    } else {
      setUsernameAvailable(null);
    }
  }, [usernameCheckData]);

  const { mutate: createCommunityMutation, isPending: createCommunityPending } =
    useMutation({
      mutationFn: (data) => createCommunity(data),
      onSuccess: async (data) => {
        if (data.status === 201) {
          toast.success("Community created successfully");
          reset();
          setOpen(false);
          queryClient.invalidateQueries(["communities"]);
        } else {
          toast.error("Something went wrong");
        }
      },
      onError: (error) => {
        console.error("Error:", error?.response?.data?.message);
        toast.error(
          error?.response?.data?.message || "Failed to create community",
        );
      },
    });

  const onSubmit = (data) => {
    if (usernameAvailable === false) {
      toast.error("Please choose an available username");
      return;
    }

    createCommunityMutation(data);
  };

  useEffect(() => {
    if (!open) {
      reset();
      setUsernameInput("");
      setDebouncedUsername("");
      setUsernameAvailable(null);
    }
  }, [open, reset]);

  const handleUsernameChange = (e) => {
    setUsernameInput(e.target.value);
  };

  const handleOpen = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }

    setOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant={triggerVariant}
        size={triggerSize}
        className={triggerClassName || "w-full"}
        onClick={handleOpen}
      >
        {triggerLabel}
      </Button>

      <DialogContent className="scrollbar-hidden max-h-[calc(100vh-120px)] overflow-y-auto rounded-[28px] border border-[#EEF2FF] bg-white p-6 shadow-xl sm:max-w-[980px] sm:p-8">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-left text-[22px] font-semibold tracking-tight text-[#101828] sm:text-[28px]">
            New Community
          </DialogTitle>

          <DialogDescription className="text-left text-sm leading-6 text-[#667085]">
            Create a new community space for contributors, builders, and members
            to connect and collaborate.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 grid gap-5 sm:grid-cols-2"
        >
          <CustomInput
            label="Community Name"
            placeholder="Enter community name"
            type="text"
            error={errors.communityName?.message}
            {...register("communityName")}
          />

          <div>
            <CustomInput
              label="Community Username"
              placeholder="Enter unique username"
              type="text"
              error={errors.communityUsername?.message}
              {...register("communityUsername", {
                onChange: handleUsernameChange,
              })}
            />

            {checkingUsername ? (
              <p className="mt-2 text-left text-sm text-[#667085]">
                Checking availability...
              </p>
            ) : usernameCheckData?.data?.content?.isAvailable === true ? (
              <p className="mt-2 text-left text-sm text-[#12B76A]">
                Username available
              </p>
            ) : usernameCheckData?.data?.content?.isAvailable === false ? (
              <p className="mt-2 text-left text-sm text-[#F04438]">
                Username taken
              </p>
            ) : null}
          </div>

          <CustomInput
            label="Website"
            placeholder="Paste website URL"
            prefix="https://"
            type="text"
            error={errors.websitePage?.message}
            {...register("websitePage")}
          />

          <CustomInput
            label="Github (Optional)"
            placeholder="Paste GitHub URL"
            prefix="https://"
            type="text"
            error={errors.githubPage?.message}
            {...register("githubPage")}
          />

          <CustomInput
            label="Twitter (Optional)"
            placeholder="Paste Twitter URL"
            prefix="https://"
            type="text"
            error={errors.twitterPage?.message}
            {...register("twitterPage")}
          />

          <CustomInput
            label="Instagram (Optional)"
            placeholder="Paste Instagram URL"
            prefix="https://"
            type="text"
            error={errors.instagramPage?.message}
            {...register("instagramPage")}
          />

          <Label className="flex flex-col items-start gap-2 text-sm font-medium text-[#344054] sm:col-span-2">
            Community Description (Optional)
            <Textarea
              className="min-h-[120px] rounded-2xl border border-[#E4E7EC] bg-[#F8FAFC] px-4 py-3 text-base placeholder:text-[#98A2B3] focus-visible:ring-0"
              placeholder="What is this community about?"
              {...register("communityDescription")}
            />
            {errors.communityDescription?.message ? (
              <span className="text-sm text-[#F04438]">
                {errors.communityDescription.message}
              </span>
            ) : null}
          </Label>

          <div className="flex justify-end pt-2 sm:col-span-2">
            <Button
              disabled={
                createCommunityPending ||
                checkingUsername ||
                usernameAvailable === false
              }
              type="submit"
              className="h-11 rounded-xl bg-[#2F0FD1] px-6 text-sm font-medium text-white hover:bg-[#2409B8]"
            >
              {createCommunityPending ? "Processing..." : "Create Community"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateCommunityForm;
