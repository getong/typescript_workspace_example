import { useForm } from "react-hook-form";

function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <div>
        <input placeholder="First name" {...register("firstName")} />
      </div>
      <div>
        <input
          placeholder="Last name"
          {...register("lastName", { required: true })}
        />
        {errors.lastName && <p>Last name is required.</p>}
      </div>
      <div>
        <input placeholder="Age" {...register("age", { pattern: /\d+/ })} />
        {errors.age && <p>Please enter number for age.</p>}
      </div>
      <input type="submit" />
    </form>
  );
}

export default App;
