"use client";
import { toast } from "sonner";
import { User, Phone, Lock, Eye, EyeOff, Key } from "lucide-react";

export function ProfileForm({ formik, showPassword, setShowPassword, isResettingPassword, setIsResettingPassword, userStatus }) {
    return (
        <div className="space-y-6">
            <div className="relative flex items-center border border-gray-200 rounded-xl px-4 py-3 bg-white focus-within:border-orange-500 transition-all">
                <span className="absolute -top-2.5 left-4 px-1.5 bg-white text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Full Name
                </span>
                <User className="text-orange-500 w-5 h-5 shrink-0 mr-3" />
                <input
                    type="text"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full bg-transparent border-0 outline-none text-sm text-gray-900 placeholder-gray-400 p-0 focus:ring-0"
                    placeholder="Customer Name"
                />
                {formik.touched.name && formik.errors.name && (
                    <span className="absolute -bottom-5 left-1 text-[11px] font-semibold text-red-500">{formik.errors.name}</span>
                )}
            </div>

            <div className="relative flex items-center border border-gray-200 rounded-xl px-4 py-3 bg-white focus-within:border-orange-500 transition-all">
                <span className="absolute -top-2.5 left-4 px-1.5 bg-white text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Phone Number
                </span>
                <Phone className="text-orange-500 w-5 h-5 shrink-0 mr-3" />
                <input
                    type="text"
                    name="phone"
                    value={formik.values.phone}
                    onChange={(e) => {
                        const cleanVal = e.target.value.replace(/[^0-9]/g, "");
                        if (cleanVal.length <= 10) {
                            formik.setFieldValue("phone", cleanVal);
                        }
                    }}
                    onBlur={formik.handleBlur}
                    className="w-full bg-transparent border-0 outline-none text-sm text-gray-900 placeholder-gray-400 p-0 focus:ring-0"
                    placeholder="8826073117"
                    maxLength={10}
                />
                {formik.touched.phone && formik.errors.phone && (
                    <span className="absolute -bottom-5 left-1 text-[11px] font-semibold text-red-500">{formik.errors.phone}</span>
                )}
            </div>

            {isResettingPassword ? (
                <div className="relative flex items-center border border-gray-200 rounded-xl px-4 py-3 bg-white focus-within:border-orange-500 transition-all">
                    <span className="absolute -top-2.5 left-4 px-1.5 bg-white text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        New Password
                    </span>
                    <Lock className="text-orange-500 w-5 h-5 shrink-0 mr-3" />
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full bg-transparent border-0 outline-none text-sm text-gray-900 placeholder-gray-400 p-0 focus:ring-0"
                        placeholder="Enter new password"
                        autoFocus
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-650 focus:outline-none shrink-0"
                    >
                        {showPassword ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
                    </button>
                    {formik.touched.password && formik.errors.password && (
                        <span className="absolute -bottom-5 left-1 text-[11px] font-semibold text-red-500">{formik.errors.password}</span>
                    )}
                </div>
            ) : (
                <div className="relative flex items-center border border-gray-200 rounded-xl px-4 py-3 bg-white transition-all">
                    <span className="absolute -top-2.5 left-4 px-1.5 bg-white text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        PASSWORD
                    </span>
                    <Lock className="text-orange-500 w-5 h-5 shrink-0 mr-3" />
                    <input
                        type="password"
                        value="••••••••"
                        disabled={true}
                        className="w-full bg-transparent border-0 outline-none text-sm text-gray-400 p-0 focus:ring-0 disabled:text-gray-450"
                    />
                    <button
                        type="button"
                        onClick={() => {
                            setIsResettingPassword(true);
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-[#f97316] hover:bg-[#ea580c] text-white font-bold text-[10px] uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer active:scale-95"
                    >
                        <Key size={12} className="stroke-[3]" />
                        Reset
                    </button>
                </div>
            )}

            <div className="flex flex-col gap-2 pt-2">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Account Status
                </label>
                <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${userStatus.toUpperCase() === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-250/30"
                            : "bg-red-50 text-red-650 border border-red-200"
                        }`}>
                        {userStatus.toUpperCase()}
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium">(Managed by administration)</span>
                </div>
            </div>
        </div>
    );
}
