'use client'

import { useState } from 'react'
import axios from 'axios'

 function UploadForm() {
  const [file, setFile] = useState<File>()

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) return

    try {
      const data = new FormData()
      data.set('file', file)

      const res = await axios.post('/api/school/create-school', {
       data ,
       name: "nitin2" ,
       code : "1234"
      
      })
      // handle the error
     
      console.log(res);
      
    } catch (e: any) {
      // Handle errors here
      console.error(e)
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        type="file"
        name="file"
        onChange={(e) => setFile(e.target.files?.[0])}
      />
      <input type="submit" value="Upload" />
    </form>
  )
}

export default UploadForm