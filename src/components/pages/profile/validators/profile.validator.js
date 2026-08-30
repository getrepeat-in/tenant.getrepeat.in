import * as Yup from "yup";

export const profileSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, "Name must be at least 2 characters")
        .required("Full name is required"),
    phone: Yup.string()
        .matches(/^[0-9]+$/, "Phone number must contain only digits")
        .length(10, "Phone number must be exactly 10 digits")
        .required("Phone number is required"),
    password: Yup.string().test(
        "is-min-length",
        "Password must be at least 6 characters",
        (val) => !val || val.length >= 6
    ),
});
