#!/bin/bash
echo 'export const raw = ' > $2
cat $1 >> $2
