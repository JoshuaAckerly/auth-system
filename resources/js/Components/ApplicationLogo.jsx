
export default function ApplicationLogo(props) {
    return (
        <img
            src="/logo.svg"
            alt="GraveYardJokes Studios Logo"
            className={props.className || "h-20 w-20"}
        />
    );
}
