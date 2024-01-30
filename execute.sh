#!/bin/sh

SHOOTS=$1
shift
SIZE=$1
shift

for SHOOT in $(seq 1 $SHOOTS)
do
  GLOBAL=0
  INDEX=1
  while read -r line;
  do
    INPUT=$(echo $line | cut -d";" -f1)
    CHARACTERS=$(echo $line | cut -d";" -f3)
    EMPTY=$(echo $line | cut -d";" -f4)
    OUTPUT=$(echo $line | cut -d";" -f5)
    START=$(date +%s%N)
    RESULT=$(timeout 10s $@ $INPUT $CHARACTERS $EMPTY)
    END=$(date +%s%N)
    NANOSECONDS=$(((END - START) / 1000))

    if [ "echo $RESULT" = "echo $OUTPUT" ]; then
      GLOBAL=$((GLOBAL+NANOSECONDS))
    else
      echo "KO on $INDEX"
      echo "$RESULT $OUTPUT"
    fi
    INDEX=$((INDEX+1))
  done < "grids/${SIZE}x${SIZE}.txt"

  printf "SHOOT %02d: %d ns\n" $SHOOT $GLOBAL
done
