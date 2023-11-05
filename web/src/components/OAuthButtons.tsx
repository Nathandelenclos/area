import React from "react";
import GlobalContext from "@src/context/GlobalContextProvider";
import { getGoogleUrl } from "@src/utils/getGoogleUrl";
import { getSpotifyUrl } from "@src/utils/getSpotifyUrl";
import { getGithubUrl } from "@src/utils/getGithubUrl";
import { getFacebookUrl } from "@src/utils/getFacebookUrl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconName } from "@fortawesome/free-brands-svg-icons";

function OAuthList() {
  type OAuth = {
    name: string;
    logo: IconName;
    color: string;
    redirect: string;
  };

  const oAuths: OAuth[] = [
    {
      name: "Facebook",
      logo: "facebook",
      color: "#3B5998",
      redirect: getFacebookUrl(),
    },
    {
      name: "Google",
      logo: "google",
      color: "#DB4437",
      redirect: getGoogleUrl("/home-page"),
    },
    {
      name: "Spotify",
      logo: "spotify",
      color: "#1ED760",
      redirect: getSpotifyUrl(),
    },
    {
      name: "Github",
      logo: "github",
      color: "#000000",
      redirect: getGithubUrl("/home-page"),
    },
  ];

  return (
    <div className="w-full justify-evenly items-center flex flex-row mt-5">
      {oAuths.map((oauth) => (
        <a
          key={oauth.name}
          className="justify-center items-center flex hover:opacity-70 text-white text-base font-bold w-1/6 px-6 py-2 rounded mt-5 mb-10"
          style={{ backgroundColor: oauth.color }}
          href={oauth.redirect}
        >
          <FontAwesomeIcon icon={["fab", oauth.logo]} size="2x" />
        </a>
      ))}
    </div>
  );
}

function ConnectionsOptionsSeparator() {
  const { translate } = GlobalContext();
  return (
    <div className="w-full justify-center items-center flex">
      <div className="flex flex-row justify-center items-center w-10/12">
        <div className="border-2 w-full border-[#DBDBDB]"></div>
        <p className="text-center min-w-max mx-2 text-[#B7B7B7]">
          {translate("login", "orConnectWith")}
        </p>
        <div className="border-2 w-full border-[#DBDBDB]"></div>
      </div>
    </div>
  );
}

export default function OAuthButtons() {
  return (
    <>
      <ConnectionsOptionsSeparator />
      <OAuthList />
    </>
  );
}
