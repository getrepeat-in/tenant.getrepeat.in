"use client";
import { useUser } from "@/hooks/useUser";
import { useState, useEffect } from "react";
import { MapPin, Plus, Loader2 } from "lucide-react";
import { AddressCard } from "./fragments/AddressCard";
import { AddressForm } from "./fragments/AddressForm";
import { useRestaurant } from "@/hooks/useRestaurant";
import useNotification from "@/hooks/useNotification";
import { UserService } from "@/services/frontend/user";
import Button from "@/components/global/common/Button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function AddressManager({ onSelectAddress, selectedAddressId, readOnly = false }) {
    const { slug } = useRestaurant();
    const { user } = useUser();
    const notify = useNotification();
    const queryClient = useQueryClient();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [formData, setFormData] = useState({
        street: "",
        city: "",
        state: "",
        zipCode: "",
        label: "Home",
        instructions: "",
        isDefault: false,
    });

    const userId = user?._id || user?.id;

    const { data: addresses = [], isLoading } = useQuery({
        queryKey: ["user-addresses", slug, userId],
        queryFn: () => UserService.getAddresses(slug),
        enabled: !!slug && !!userId,
    });

    useEffect(() => {
        if (!selectedAddressId && addresses.length > 0 && onSelectAddress) {
            const defaultAddress = addresses.find(a => a.isDefault) || addresses[0];
            if (defaultAddress) {
                onSelectAddress(defaultAddress);
            }
        }
    }, [addresses, selectedAddressId, onSelectAddress]);

    const addMutation = useMutation({
        mutationFn: (newAddress) => UserService.addAddress(slug, newAddress),
        onSuccess: () => {
            queryClient.invalidateQueries(["user-addresses", slug, userId]);
            notify.success("Address added successfully");
            closeForm();
        },
        onError: (err) => {
            notify.error(err.message || "Failed to add address");
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ addressId, data }) => UserService.updateAddress(slug, addressId, data),
        onSuccess: () => {
            queryClient.invalidateQueries(["user-addresses", slug, userId]);
            notify.success("Address updated successfully");
            closeForm();
        },
        onError: (err) => {
            notify.error(err.message || "Failed to update address");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (addressId) => UserService.deleteAddress(slug, addressId),
        onSuccess: () => {
            queryClient.invalidateQueries(["user-addresses", slug, userId]);
            notify.success("Address deleted successfully");
            setDeletingId(null);
        },
        onError: (err) => {
            notify.error(err.message || "Failed to delete address");
            setDeletingId(null);
        }
    });

    const handleDelete = (addressId) => {
        setDeletingId(addressId);
        deleteMutation.mutate(addressId);
    };

    const openForm = (address = null) => {
        if (address) {
            setEditingAddress(address);
            setFormData({
                street: address.street || "",
                city: address.city || "",
                state: address.state || "",
                zipCode: address.zipCode || "",
                label: address.label || "Home",
                instructions: address.instructions || "",
                isDefault: address.isDefault || false,
            });
        } else {
            setEditingAddress(null);
            setFormData({
                street: "",
                city: "",
                state: "",
                zipCode: "",
                label: "Home",
                instructions: "",
                isDefault: addresses.length === 0,
            });
        }
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingAddress(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.street || !formData.city || !formData.zipCode) {
            notify.error("Please fill in all required fields");
            return;
        }

        if (editingAddress) {
            updateMutation.mutate({
                addressId: editingAddress._id,
                data: formData
            });
        } else {
            addMutation.mutate(formData);
        }
    };

    if (!user) {
        return (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-600 rounded-xl text-sm text-center">
                Please log in to manage your addresses.
            </div>
        );
    }

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-neutral-800 dark:text-zinc-100 flex items-center gap-2">
                    <MapPin size={16} className="text-primary" />
                    Saved Addresses
                </h3>
                {!readOnly && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => openForm()}
                        className="h-8 px-2 text-xs font-semibold text-primary hover:bg-primary/10"
                    >
                        <Plus size={14} className="mr-1" /> Add New
                    </Button>
                )}
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center p-8">
                    <Loader2 size={24} className="animate-spin text-primary" />
                </div>
            ) : addresses.length === 0 ? (
                <div className="text-center p-6 bg-neutral-50 dark:bg-zinc-900/50 rounded-md border border-dashed border-neutral-200 dark:border-zinc-800">
                    <MapPin size={24} className="mx-auto text-neutral-400 mb-2" />
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">No saved addresses found.</p>
                    {!readOnly && (
                        <Button
                            onClick={() => openForm()}
                            className="bg-primary text-primary-foreground h-9 text-xs rounded-md shadow-md shadow-primary/20"
                        >
                            Add Your First Address
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid gap-2.5">
                    {addresses.map((address) => (
                        <AddressCard
                            key={address._id}
                            address={address}
                            isSelected={selectedAddressId === address._id}
                            isDeleting={deletingId === address._id}
                            isPendingDelete={deleteMutation.isPending}
                            onSelect={onSelectAddress}
                            onEdit={openForm}
                            onDelete={handleDelete}
                            readOnly={readOnly}
                        />
                    ))}
                </div>
            )}

            <AddressForm
                isOpen={isFormOpen}
                onClose={closeForm}
                onSubmit={handleSubmit}
                formData={formData}
                setFormData={setFormData}
                isEditing={!!editingAddress}
                isPending={addMutation.isPending || updateMutation.isPending}
            />
        </div>
    );
}

export default AddressManager;
