# vue-form-layout
The system based on 3 components using CSS Grid Layout and HTML-table usage like.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Examples
#### Simplelayout
```
<FormLayout>
    <FormLayoutColumn>
        <FormLayoutCell>
            <PlaceHolder />
        </FormLayoutCell>

        <FormLayoutCell>
            <PlaceHolder />
        </FormLayoutCell>

        <FormLayoutCell>
            <PlaceHolder />
        </FormLayoutCell>

        <FormLayoutCell>
            <PlaceHolder />
        </FormLayoutCell>
    </FormLayoutColumn>

    <FormLayoutColumn>
        <FormLayoutCell>
            <PlaceHolder />
        </FormLayoutCell>

        <FormLayoutCell>
            <PlaceHolder />
        </FormLayoutCell>

        <FormLayoutCell>
            <PlaceHolder />
        </FormLayoutCell>

        <FormLayoutCell>
            <PlaceHolder />
        </FormLayoutCell>
    </FormLayoutColumn>

    <FormLayoutColumn>
        <FormLayoutCell>
            <PlaceHolder />
        </FormLayoutCell>

        <FormLayoutCell>
            <PlaceHolder />
        </FormLayoutCell>

        <FormLayoutCell>
            <PlaceHolder />
        </FormLayoutCell>

        <FormLayoutCell>
            <PlaceHolder />
        </FormLayoutCell>
    </FormLayoutColumn>
</FormLayout>
```

![image](https://user-images.githubusercontent.com/80147461/157750673-179e5295-11ed-4147-be7f-f0bcf82e9031.png)

#### Layout with a column ratio
```
<FormLayout>
    <FormLayoutColumn :colspan="3">
        <FormLayoutCell>
            <PlaceHolder />
        </FormLayoutCell>

        <FormLayoutCell>
            <PlaceHolder />
        </FormLayoutCell>

        <FormLayoutCell>
            <PlaceHolder />
        </FormLayoutCell>

        <FormLayoutCell>
            <PlaceHolder />
        </FormLayoutCell>
    </FormLayoutColumn>

    <FormLayoutColumn :colspan="2">
        <FormLayoutCell>
            <PlaceHolder />
        </FormLayoutCell>

        <FormLayoutCell>
            <PlaceHolder />
        </FormLayoutCell>

        <FormLayoutCell>
            <PlaceHolder />
        </FormLayoutCell>

        <FormLayoutCell>
            <PlaceHolder />
        </FormLayoutCell>
    </FormLayoutColumn>

    <FormLayoutColumn>
        <FormLayoutCell>
            <PlaceHolder />
        </FormLayoutCell>

        <FormLayoutCell>
            <PlaceHolder />
        </FormLayoutCell>

        <FormLayoutCell>
            <PlaceHolder />
        </FormLayoutCell>

        <FormLayoutCell>
            <PlaceHolder />
        </FormLayoutCell>
    </FormLayoutColumn>
</FormLayout>
```
![image](https://user-images.githubusercontent.com/80147461/157752734-7ba202ec-df62-420a-8197-1ffb7398a1a0.png)

#### Layout with cell size manipulation

```
<FormLayout>
    <FormLayoutColumn>
        <FormLayoutCell :colspan="2" :rowspan="2">
            <PlaceHolder :colspan="2" />
        </FormLayoutCell>

        <FormLayoutCell>
            <PlaceHolder />
        </FormLayoutCell>

        <FormLayoutCell>
            <PlaceHolder />
        </FormLayoutCell>
    </FormLayoutColumn>

    <FormLayoutColumn>
        <FormLayoutCell :colspan="2">
            <PlaceHolder :colspan="2" />
        </FormLayoutCell>
    </FormLayoutColumn>

    <FormLayoutColumn>
        <FormLayoutCell>
            <PlaceHolder />
        </FormLayoutCell>

        <FormLayoutCell :colspan="3">
            <PlaceHolder :colspan="3" />
        </FormLayoutCell>
    </FormLayoutColumn>
</FormLayout>
```

![image](https://user-images.githubusercontent.com/80147461/157754440-e6b988b0-af79-4742-84c7-330052a3a6d9.png)
