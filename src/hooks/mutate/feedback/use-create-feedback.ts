import axiosInstance from '@/apis/request';
import { CreateFeedbackPayload } from '@/stores/feedback/feedback';
import { CreatePostPayload } from '@/types/post/post';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useCreateFeedback = (
    options: UseMutationOptions<unknown, AxiosError<unknown>, CreateFeedbackPayload> = {},
) => {
    const createFeedback = async (payload: CreateFeedbackPayload) => {
        return axiosInstance.post('/feedback/create', payload);
    };

    return useMutation<unknown, AxiosError<unknown>, CreateFeedbackPayload>({
        mutationKey: ['feedback', 'create'],
        mutationFn: payload => createFeedback(payload),
        ...options,
    });
};