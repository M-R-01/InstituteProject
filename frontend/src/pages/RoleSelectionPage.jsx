import React from "react";

function RoleSelectionPage() {
  return (
    <>
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <div className="sm:h-[35rem] sm:w-2/3 flex flex-col items-center justify-center sm:space-y-4">
          <div className="text-xl sm:text-2xl text-black">Login as a-</div>
          <div className="h-[31rem] w-full sm:h-[25rem] sm:w-4/5 mx-auto flex sm:flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-center ">
            <div className="h-[14rem] w-full sm:h-full sm:w-1/2 flex flex-col items-center justify-center space-y-2 sm:space-y-4 sm:border-r-2 sm:border-dotted">
                <div className="font-bold text-xl sm:text-2xl underline text-[#B98389]">Faculty</div>
                <div className="h-[12rem] w-[8rem] sm:h-[20rem] sm:w-[15rem] ">
                    <img className="h-[12rem] w-[8rem] sm:h-[20rem] sm:w-[15rem] " src='https://s3-alpha-sig.figma.com/img/2271/3ef0/4a076931e97b7332a61356da48be683d?Expires=1742169600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=VQwM9pb6Bg1LUcl-GqvGt97Yqanh2XDrfNIX9p~bNgms6iIBUSXSdal4B7W-INWJ9WOr3NyJBL4H1HG8eOflmBe-UXK-S3s-FbwuYHOeYHgmqPjHZcBWvQAP5dKOIA6vJdLH225zp~MlttgSYY8yzxH~Yn9nUOel1ZO9yGJmtD1Q-sRHg4Uw2l9GndSVQVxdC1xVNU1krE2g9CleRZEoZ4E2TGhw8zx15c7t5pHK7dRVyYEPgHlWaMxXGY57laXk8RcxPMBuyFX96u09YOBSxVJT~cRyRs3cKZnt~jwOHl8~omf5QXgaORtccX0djaRMlhJyrKaijN4vJfMAbn9fLg__' alt="faculty" />
                </div>
            </div>
            <div className="h-[14rem] w-full sm:h-full sm:w-1/2 flex flex-col items-center justify-center sm:space-y-4 ">
                <div className="font-bold text-xl sm:text-2xl underline text-[#B98389]">Reviewer</div>
                <div className="h-[12rem] w-[8rem] sm:h-[20rem] sm:w-[15rem] ">
                    <img className="h-[12rem] w-[8rem] sm:h-[20rem] sm:w-[15rem] " src='https://s3-alpha-sig.figma.com/img/b017/7336/0230dfdd48fd67af9eb35359f3c5daca?Expires=1742169600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=TAER1zOaLukk8kiGNjI0iVsp1FcW7zzziCuSwiUzvF~QiSzUkXXyO2l3xfu79yKIVWUI-hmav~JGeK74iEvRBUqXQ9zbSFS8K8nHGxlmuMaGXKajKS6LMaU74X1WAH~H5f18oLGP1zBYwf-G1velJD~scLS8TonStRd-PMfxqugHNTe5TAFYtgTwLniOEGXFreRWZ8ZyLNBLHuA2HE8eOijgZmAJEpWk7BxcEVaI5ZOXMSpSnJj9R4Y3NWcO1pPblLDIAVkBQECWWe0K55xsbuwEiMjjYGjONxJbUy4XCPY0FdOD9YlRO7K-CBkSSwgNZHiXioyuJX60lhpFkoQ3lg__' alt='reviewer' />
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RoleSelectionPage;
