import Avatar from "./Avatar";

type Props = {
    name: string;
    email?: string;
};

export default function UserCell({ name, email }: Props) {
    return (
        <div className="d-flex align-items-center gap-3 overflow-hidden">
            <Avatar name={name} size={40} />
            <div className="overflow-hidden">
                <div className="fw-semibold text-truncate">{name}</div>
                {email && <div className="small text-secondary text-truncate">{email}</div>}
            </div>
        </div>
    );
}
