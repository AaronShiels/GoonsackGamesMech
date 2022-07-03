import { System } from "../../common/systems/system.js";

const syncSystem: System = (state) => {
	const entityRecordsList = state.connection.record.getList("entities");
	if (!entityRecordsList.isReady) return;

	// Synchronise new and existing entries
	const knownRecordIds = entityRecordsList.getEntries();
	for (const entity of state.entities) {
		if (!knownRecordIds.includes(entity.id)) {
			entityRecordsList.addEntry(entity.id);
			console.debug(`Entity record ${entity.id} created`);
		}

		const entityRecord = state.connection.record.getRecord(entity.id);
		if (!entityRecord.isReady) continue;

		// TODO sync attributes
	}

	// Clear out deleted entries
	const actualEntityIds = state.entities.map((e) => e.id);
	const staleRecordIds = knownRecordIds.filter((id) => !actualEntityIds.includes(id));
	for (const staleRecordId of staleRecordIds) {
		entityRecordsList.removeEntry(staleRecordId);
		state.connection.record.delete(staleRecordId);
		console.debug(`Entity record ${staleRecordId} created`);
	}
};

export { syncSystem };
