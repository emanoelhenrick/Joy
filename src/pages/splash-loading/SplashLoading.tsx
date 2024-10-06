import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { getMetadata } from "@/core/files/getMetadata";

export function SplashLoading() {
  const navigate = useNavigate();

  const { isSuccess, data  } = useQuery({ queryKey: ['playlistExists'], queryFn: getMetadata, staleTime: Infinity })

  useEffect(() => {

    if (isSuccess) {
      if (data.playlists.length === 0) return navigate('/initial')
      navigate(`/home/${data!.playlists[0]}`)
    }

  }, [isSuccess])

  return (
    <div></div>
  )
}