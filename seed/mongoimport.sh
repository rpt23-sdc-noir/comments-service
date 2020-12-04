#!/bin/bash

mongoimport --type csv -d fec-soundcloud-comments -c comments --headerline --drop /Users/abhogle/Documents/RPT23/SDC/comments-service/seed/comments.csv