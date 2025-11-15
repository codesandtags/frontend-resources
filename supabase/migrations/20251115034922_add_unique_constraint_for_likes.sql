ALTER TABLE public.likes
ADD CONSTRAINT unique_user_resource_like
UNIQUE (user_id, resource_id);