import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import AdminLayout from '@/Layouts/AdminLayout';
import { SiteHeader } from '@/Components/site-header';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AdminLayout siteHeader={<SiteHeader name="Profile"></SiteHeader>}>
            <Head title="Profile" />

            <div className="">
                <div className="mx-auto w-full space-y-4">
                    <div className="p-4 border sm:rounded-lg sm:p-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="p-4 border sm:rounded-lg sm:p-8">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="p-4 border sm:rounded-lg sm:p-8">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
