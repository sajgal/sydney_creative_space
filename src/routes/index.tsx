import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
// import { deleteImage, getServerTime } from "../server-functions";
// import toast from "react-hot-toast";
import { Separator } from '~/components/ui/separator'

export const Route = createFileRoute('/')({
  component: Home,
  // loader: () => getServerTime(),
})

function Home() {
  // const servertime = Route.useLoaderData();
  // const handleDeleteImage = async () => {
  //   const {result} = await deleteImage();

  //   console.log("---------- deleteImage result", result);
  //   toast.error(result);
  // };

  return (
    <div className="mx-auto max-w-3xl p-4">
      <section className="mb-6 flex items-center justify-between">
        <h1 className="mb-4 text-2xl font-bold">
          Sydney
          <br />
          Creative
          <br />
          .space
        </h1>
      </section>

      <Separator />

      <section className="mt-2 mb-6 p-4">
        <div className="text-center text-2xl">Images comming</div>
        <div className="text-center text-2xl">soon</div>

        <Separator />

        <Link to="/gallery">
          <Button>Dashboard &gt; Gallery</Button>
        </Link>
      </section>
    </div>
  )
}
