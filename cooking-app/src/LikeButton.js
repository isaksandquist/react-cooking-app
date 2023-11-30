import React from "react";

export const LikeButton = React.memo(({likeIncrement}) => {
    return <button onClick={likeIncrement}>&#9829;</button>
});