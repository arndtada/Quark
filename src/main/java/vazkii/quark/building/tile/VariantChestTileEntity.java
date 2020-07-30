package vazkii.quark.building.tile;

import net.minecraft.tileentity.ChestTileEntity;
import net.minecraft.tileentity.TileEntityType;
import net.minecraft.util.math.AxisAlignedBB;
import vazkii.quark.building.module.VariantChestsModule;

public class VariantChestTileEntity extends ChestTileEntity {

	protected VariantChestTileEntity(TileEntityType<?> typeIn) {
		super(typeIn);
	}

	public VariantChestTileEntity() {
		super(VariantChestsModule.chestTEType);
	}

	@Override
	public AxisAlignedBB getRenderBoundingBox() {
		return new AxisAlignedBB(pos.getX() - 1, pos.getY(), pos.getZ() - 1, pos.getX() + 2, pos.getY() + 2, pos.getZ() + 2);
	}

}
