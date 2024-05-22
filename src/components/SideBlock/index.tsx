import React from "react";
import {Typography, Paper} from "@mui/material";
import styles from "./SideBlock.module.scss";

interface SideBlockProps {
  title: string
  children: React.ReactNode
}

export const SideBlock = ({ title, children }: SideBlockProps) => {
  return (
    <Paper elevation={0} classes={{ root: styles.root }}>
      <Typography variant="h6" classes={{ root: styles.title }}>
        {title}
      </Typography>
      {children}
    </Paper>
  );
};
