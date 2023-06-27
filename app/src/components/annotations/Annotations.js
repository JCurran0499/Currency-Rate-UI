import './Annotations.css'

export const Annotations = () => {
    const docsLink = 'https://github.com/JCurran0499/MatrixScript-Docs/blob/main/docs.md'

    return (
        <div id="annotations">
            <p>&copy; Jack Curran, 2023 | <a href={docsLink} target="_blank">Read the Docs</a></p>
        </div>
    )
}