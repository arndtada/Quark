package vazkii.quark.tools.module;

import net.minecraft.block.Block;
import net.minecraft.entity.player.PlayerEntity;
import net.minecraft.item.Item;
import net.minecraft.item.ItemStack;
import net.minecraft.item.Items;
import net.minecraft.tileentity.TileEntityType;
import net.minecraft.util.ActionResultType;
import net.minecraftforge.event.entity.player.PlayerInteractEvent;
import net.minecraftforge.eventbus.api.SubscribeEvent;
import net.minecraftforge.fml.client.registry.ClientRegistry;
import vazkii.arl.util.RegistryHelper;
import vazkii.quark.base.module.Config;
import vazkii.quark.base.module.LoadModule;
import vazkii.quark.base.module.Module;
import vazkii.quark.base.module.ModuleCategory;
import vazkii.quark.tools.block.CloudBlock;
import vazkii.quark.tools.client.render.CloudTileEntityRenderer;
import vazkii.quark.tools.item.BottledCloudItem;
import vazkii.quark.tools.tile.CloudTileEntity;

@LoadModule(category = ModuleCategory.TOOLS, hasSubscriptions = true)
public class BottledCloudModule extends Module {

    public static TileEntityType<CloudTileEntity> tileEntityType;
    public static Block cloud;
    public static Item bottled_cloud;
    
    @Config 
    public static int cloudLevelBottom = 127;
    
    @Config 
    public static int cloudLevelTop = 132;

	@Override
	public void construct() {
		cloud = new CloudBlock(this);
		bottled_cloud = new BottledCloudItem(this);
		
    	tileEntityType = TileEntityType.Builder.create(CloudTileEntity::new, cloud).build(null);
		RegistryHelper.register(tileEntityType, "cloud");
	} 
	
	@Override
	public void clientSetup() {
		ClientRegistry.bindTileEntityRenderer(tileEntityType, CloudTileEntityRenderer::new);
	}
	
	@SubscribeEvent
	public void onRightClick(PlayerInteractEvent.RightClickItem event) {
		ItemStack stack = event.getItemStack();
		PlayerEntity player = event.getPlayer();
		if(stack.getItem() == Items.GLASS_BOTTLE && player.getPosY() > cloudLevelBottom && player.getPosY() < cloudLevelTop) {
			stack.shrink(1);
			
			ItemStack returnStack = new ItemStack(bottled_cloud);
			if(!player.addItemStackToInventory(returnStack))
				player.dropItem(returnStack, false);
			
			event.setCanceled(true);
			event.setCancellationResult(ActionResultType.SUCCESS);
		}
	}
	
}
