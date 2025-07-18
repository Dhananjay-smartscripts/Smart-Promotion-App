import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { handleApiError } from "../utils/handleApiError";
import Select from "react-select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";

// Schema initialization
const schema = yup.object().shape({
  title: yup
    .string()
    .required("Plan Name is required")
    .min(3, "Minimum 3 characters required.")
    .max(200, "Maximum 200 characters allowed."),
  description: yup
    .string()
    .required("Plan Description is required")
    .min(3, "Minimum 3 characters required.")
    .max(200, "Maximum 200 characters allowed."),
  validity: yup
    .string()
    .required("Plan Validity is required")
    .min(1, "Minimum 1 character required.")
    .max(3, "Maximum 3 characters allowed."),
  price: yup
    .string()
    .required("Plan Price is required")
    .min(2, "Minimum 2 digits required.")
    .max(5, "Maximum 5 digits allowed."),
  type: yup
    .string()
    .required("Plan Type is required")
    .min(3, "Minimum 3 characters required.")
    .max(50, "Maximum 50 characters allowed."),
});

const AddPlan = () => {
  // Navigation function
  const navigate = useNavigate();

  // Access token
  const { token, user } = useSelector((state) => state.auth);

  // API URL
  const APP_URL = import.meta.env.VITE_API_URL;

  const types = [
    { value: "plan", label: "Plan" },
    { value: "addon", label: "Add-On" },
  ];

  // Quill modules configuration
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  // useForm hook initialization
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  // Handle submit
  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("validity", data.validity);
    formData.append("price", data.price);
    formData.append("plan_type", data.type);

    try {
      const res = await axios.post(
        `${APP_URL}/${user.rolename}/plans`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.status === 201) {
        toast.success(res.data.message);
        setTimeout(() => {
          navigate("/admin/plans");
        }, 2000);
      }
    } catch (error) {
      handleApiError(error, "adding", "plan");
    }
  };

  // Handle cancel
  const handleCancel = () => {
    reset();
    navigate("/admin/plans");
  };

  return (
    <div className="px-4 py-3 page-body">
      <Toaster />
      <div className="card">
        <div className="card-header py-3 bg-transparent border-bottom-0">
          <h4 className="title-font mt-2 mb-0">
            <strong>Add New Plan</strong>
          </h4>
          <Link className="btn btn-info text-white" to="/admin/plans">
            Back
          </Link>
        </div>
        <div className="card-body card-main-one">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="text"
                    className={`form-control ${
                      errors.title ? "is-invalid" : ""
                    }`}
                    {...register("title")}
                    placeholder="Plan Name"
                    tabIndex="1"
                  />
                  <label htmlFor="title" className="col-form-label">
                    Plan Name
                  </label>
                  {errors.title && (
                    <div className="invalid-feedback">
                      {errors.title.message}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="text"
                    inputMode="decimal"
                    maxLength={3}
                    onInput={(e) => {
                      e.target.value = e.target.value
                        .replace(/[^0-9.]/g, "") // Allow only digits and a decimal point
                        .replace(/(\..*)\./g, "$1") // Prevent multiple decimals
                        .replace(/^0+(?=\d)/, "") // Prevent leading zeros like 007 -> 7
                        .replace(/(\.\d{2})\d+/, "$1"); // Allow only up to 2 decimal places
                    }}
                    className={`form-control ${
                      errors.validity ? "is-invalid" : ""
                    }`}
                    {...register("validity")}
                    placeholder="Plan Validity"
                    tabIndex="3"
                  />
                  <label htmlFor="validity" className="col-form-label">
                    Plan Validity
                  </label>
                  {errors.validity && (
                    <div className="invalid-feedback">
                      {errors.validity.message}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="text"
                    inputMode="decimal"
                    maxLength={5}
                    onInput={(e) => {
                      e.target.value = e.target.value
                        .replace(/[^0-9.]/g, "") // Allow only digits and a decimal point
                        .replace(/(\..*)\./g, "$1") // Prevent multiple decimals
                        .replace(/^0+(?=\d)/, "") // Prevent leading zeros like 007 -> 7
                        .replace(/(\.\d{2})\d+/, "$1"); // Allow only up to 2 decimal places
                    }}
                    className={`form-control ${
                      errors.price ? "is-invalid" : ""
                    }`}
                    {...register("price")}
                    placeholder="Plan Price"
                    tabIndex="3"
                  />
                  <label htmlFor="price" className="col-form-label">
                    Plan Price
                  </label>
                  {errors.price && (
                    <div className="invalid-feedback">
                      {errors.price.message}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-floating">
                  <Controller
                    name="type"
                    control={control}
                    rules={{ required: "Plan Type is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={types}
                        tabIndex="4"
                        className={`basic-single ${
                          errors.type ? "is-invalid" : ""
                        }`}
                        classNamePrefix="select"
                        isClearable={true}
                        isSearchable={true}
                        placeholder="Select plan type"
                        value={
                          types.find((type) => type.value === field.value) ||
                          null
                        }
                        onChange={(selectedOption) =>
                          field.onChange(
                            selectedOption ? selectedOption.value : ""
                          )
                        }
                        styles={{
                          control: (baseStyles) => ({
                            ...baseStyles,
                            height: "calc(3.5rem + 2px)",
                            borderRadius: "0.375rem",
                            border: "1px solid #ced4da",
                          }),
                          valueContainer: (baseStyles) => ({
                            ...baseStyles,
                            height: "100%",
                            padding: "0.7rem 0.6rem",
                          }),
                          placeholder: (baseStyles) => ({
                            ...baseStyles,
                            color: "#6c757d",
                          }),
                          input: (baseStyles) => ({
                            ...baseStyles,
                            margin: 0,
                            padding: 0,
                          }),
                          menu: (baseStyles) => ({
                            ...baseStyles,
                            zIndex: 9999,
                          }),
                        }}
                      />
                    )}
                  />
                  {errors.type && (
                    <div className="invalid-feedback">
                      {errors.type.message}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-12">
                <Controller
                  name="description"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <ReactQuill
                        theme="snow"
                        placeholder="Enter plan description..."
                        modules={modules}
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        tabIndex="2"
                        className={errors.description ? "is-invalid" : ""}
                      />
                      {errors.description && (
                        <div className="invalid-feedback">
                          {errors.description.message}
                        </div>
                      )}
                    </>
                  )}
                />
              </div>
              <div className="col-12">
                <button
                  tabIndex="5"
                  className="me-1 btn btn-primary"
                  type="submit"
                >
                  Add Plan
                </button>
                <button
                  tabIndex="6"
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPlan;
