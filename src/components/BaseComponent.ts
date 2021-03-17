interface BaseComponent {
	destroyed: boolean;
}

const isEntity = (object: any): object is BaseComponent => "destroyed" in object;

export default BaseComponent;
export { isEntity };
