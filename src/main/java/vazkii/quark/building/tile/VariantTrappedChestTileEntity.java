package vazkii.quark.building.tile;

import vazkii.quark.building.module.VariantChestsModule;

public class VariantTrappedChestTileEntity extends VariantChestTileEntity {

	public VariantTrappedChestTileEntity() {
		super(VariantChestsModule.trappedChestTEType);
	}

	protected void onOpenOrClose() {
		super.onOpenOrClose();
		this.world.notifyNeighborsOfStateChange(this.pos.down(), this.getBlockState().getBlock());
	}

}
