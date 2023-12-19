const { instagramOneProfile, instagramTwoProfile, instagramThreeProfile, instagramFourProfile, instagramFiveProfile, instagramSixProfile, instagramSevenProfile, instagramEightProfile, instagramNineProfile, instagramTenProfile } = require("./profilePictureLink");
const { instagramOne, instagramTwo, instagramThree, instagramFour, instagramFive, instagramSix, instagramSeven, instagramEight, instagramNine, instagramTen } = require("./rss_constants");

const instagramList=[
    {
        "rss":instagramOne,
        'profilePicture':instagramOneProfile
    },
    {
        "rss":instagramTwo,
        'profilePicture':instagramTwoProfile
    },
    {
        "rss":instagramThree,
        'profilePicture':instagramThreeProfile
    },
    {
        "rss":instagramFour,
        'profilePicture':instagramFourProfile
    },
    {
        "rss":instagramFive,
        'profilePicture':instagramFiveProfile
    },
    {
        "rss":instagramSix,
        'profilePicture':instagramSixProfile
    },
    {
        "rss":instagramSeven,
        'profilePicture':instagramSevenProfile
    },
    {
        "rss":instagramEight,
        'profilePicture':instagramEightProfile
    },
    {
        "rss":instagramNine,
        'profilePicture':instagramNineProfile
    },
    {
        "rss":instagramTen,
        'profilePicture':instagramTenProfile
    },
]
module.exports={instagramList}