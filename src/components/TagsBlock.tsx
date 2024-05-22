import React from "react";
import { Link } from "react-router-dom";
import {List, ListItem, ListItemButton, ListItemIcon, ListItemText, Skeleton} from "@mui/material";
import TagIcon from "@mui/icons-material/Tag";

import { SideBlock } from "./SideBlock";
import { Tags } from "../types/api";

interface TagsBlockProps {
  items: Tags
  isLoading: boolean
}

export const TagsBlock = ({ items, isLoading = true }: TagsBlockProps) => {
  const uniqueItems = Array.from(new Set(items))

  return (
    <SideBlock title="Тэги">
      <List>
        {(isLoading ? [...Array(5)] : uniqueItems).map((name, i) => (
          <Link
            key={i}
            style={{ textDecoration: "none", color: "black" }}
            to={`/tags/${name}`}
          >
            <ListItem  disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <TagIcon />
                </ListItemIcon>
                {isLoading ? (
                  <Skeleton width={100} />
                ) : (
                  <ListItemText primary={name} />
                )}
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </SideBlock>
  );
};
