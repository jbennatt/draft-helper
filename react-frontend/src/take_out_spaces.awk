BEGIN {
    FS = ":"
}

{
    better_key = tolower($1)
    # trim leading and trailing white space, from: https://stackoverflow.com/questions/20600982/trim-leading-and-trailing-spaces-from-a-string-in-awk
    gsub(/^[ \t]+|[ \t]+$/, "", better_key)
    # change inner spaces to underscores
    gsub(/\s/, "_", better_key)

    if(NF < 2)
    {
        line = better_key
    }
    else
    {
        line = better_key ":" $2
    }

    print line
}