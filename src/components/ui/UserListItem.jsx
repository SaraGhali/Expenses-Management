import { Button } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

function UserListItem(item) {
  return (
   <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
        <Typography variant="h6">{item.name}</Typography>
        <Button variant="outlined" color="primary" sx={{ mt: 1 }}></Button>
   </Box>
  );
}

export default UserListItem;