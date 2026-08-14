import { createServerFn } from '@tanstack/react-start'

export const getFolder = createServerFn().handler(() => {
  console.log('----- running get folder fn')

  // return fetch(
  //   'https://api.cloudinary.com/v1_1/dqjl6uv1s/resources/image',
  //   {
  //     method: 'get',
  //     headers: {
  //       Authorization:
  //         'Basic ' +
  //         Base64.encode(
  //           import.meta.env.VITE_PUBLIC_CLOUDINARY_KEY +
  //             ':' +
  //             import.meta.env.VITE_PUBLIC_CLOUDINARY_SECRET,
  //         ),
  //     },
  //   },
  // ).then((res) => res.json())

  return [1, 2, 5]
})
