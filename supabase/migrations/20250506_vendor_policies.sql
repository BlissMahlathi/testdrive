
-- Allow authenticated users to create vendor records for themselves
CREATE POLICY "Users can create their own vendor profile"
ON public.vendors
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow users to read their own vendor profile
CREATE POLICY "Users can view their own vendor profile"
ON public.vendors
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow admins to read and update all vendor profiles using the get_user_role function
CREATE POLICY "Admins can view all vendor profiles"
ON public.vendors
FOR SELECT
TO authenticated
USING (public.get_user_role(auth.uid()) = 'ADMIN');

CREATE POLICY "Admins can update all vendor profiles"
ON public.vendors
FOR UPDATE
TO authenticated
USING (public.get_user_role(auth.uid()) = 'ADMIN')
WITH CHECK (public.get_user_role(auth.uid()) = 'ADMIN');
